import {Request, Response} from "express";
import Purchase from "../models/purchaseModel";
import Product from "../models/productModel";
import User from "../models/userModel";
import Brand from "../models/brandModel";

function generateDateRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export const dashboardService = {
    getTotalPurchase: async (req: Request, res: Response) => {
        try {
            const totalPurchase = await Purchase.estimatedDocumentCount()
            const totalPurchaseAmount = await Purchase.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: {$sum: "$totalAmount"}
                    }
                }
            ])
            const totalAmount = totalPurchaseAmount.length > 0 ? totalPurchaseAmount[0].totalAmount : 0;
            const totalProduct = await Product.estimatedDocumentCount();
            const totalUser = await User.estimatedDocumentCount();

            const total = await Purchase.aggregate([
                {
                    '$unwind': '$products'
                }, {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'products.product',
                        'foreignField': '_id',
                        'as': 'productDetails'
                    }
                }, {
                    '$unwind': '$productDetails'
                }, {
                    '$group': {
                        '_id': '$productDetails.brand',
                        'totalAmount': {'$sum': '$totalAmount'}
                    },
                }, {
                    '$sort': {
                        'totalAmount': -1
                    }
                }, {
                    '$limit': 1
                }
            ]);

            const brand = await Brand.findById(total[0]._id);
            const bestBrand = brand.title;

            const bestBrandPurchase = total[0].totalAmount;

            const ranking = await Purchase.aggregate([
                {$unwind: "$products"}, // Flatten the products array
                {
                    $group: {
                        _id: "$products.product", // Group by product ID
                        totalQuantity: {$sum: "$products.quantity"} // Sum the quantity for each product
                    }
                },
                {$sort: {totalQuantity: -1}}, // Sort by total quantity in descending order
                {$limit: 10}, // Limit the results to top 10
                {
                    $lookup: {
                        from: "products", // Lookup product details from the 'products' collection
                        localField: "_id", // The field to match in the 'products' collection
                        foreignField: "_id", // The field to match in the 'products' collection
                        as: "productDetails" // Alias for the matched data
                    }
                },
                {$unwind: "$productDetails"}, // Flatten the product details
                {
                    $project: {
                        productId: "$_id", // Return the product ID
                        productName: "$productDetails.title", // Return product name
                        totalQuantity: 1, // Return total quantity sold
                    }
                },
            ]);

            // console.log(ranking);


            res.status(200).json({
                acknowledgement: true,
                message: "Ok",
                description: "Dashboard fetched successfully",
                data: {totalPurchase, totalAmount, totalProduct, totalUser, bestBrand, bestBrandPurchase, ranking}
            });
        } catch (error) {
            res.status(400).json({
                acknowledgement: false,
                message: "Bad Request",
                description: (error as Error).message,
            });
        }
    },
    getRevenue: async (req: Request, res: Response) => {
        const period = req.params.period;
        // console.log('Period:', period);
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - (period === 'Week' ? 7 : 30));

        const last14Days = new Date(today);
        last14Days.setDate(today.getDate() - (period === 'Week' ? 14 : 60));

        const datesLast7Days = generateDateRange(last7Days, today);
        const datesPrevious7Days = generateDateRange(last14Days, last7Days);
        const getDailyRevenue = async (startDate: Date, endDate: Date, dateRange: string[]) => {
            return Purchase
                .aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: startDate,
                                $lt: endDate
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                day: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}}
                            },
                            totalRevenue: {$sum: '$totalAmount'}
                        }
                    },
                    {
                        $sort: {'_id.day': 1}
                    }
                ])

                .then((results: any) => {
                    // Ensure all dates in the range appear with zero revenue if missing
                    return dateRange.map((date) => {
                        const found = results.find((r: any) => r._id.day === date);
                        return {
                            date,
                            totalRevenue: found ? found.totalRevenue : 0
                        };
                    });
                });
        };

        const last7DaysRevenue = await getDailyRevenue(last7Days, today, datesLast7Days);
        const previous7DaysRevenue = await getDailyRevenue(last14Days, last7Days, datesPrevious7Days);

        // console.log('Daily Revenue for the last 7 days:', last7DaysRevenue);
        // console.log('Daily Revenue for the previous 7 days:', previous7DaysRevenue);
        res.status(200).json({
            acknowledgement: true,
            message: "Ok",
            description: "Dashboard fetched successfully",
            data: {last7DaysRevenue, previous7DaysRevenue}
        });

    }
}