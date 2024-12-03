'use client'

import React, {useEffect, useState} from "react";
import {Eye, ShoppingBag, ShoppingCart, Users} from 'lucide-react'
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js'
import {Bar, Line} from 'react-chartjs-2'
import Dashboard from "@/components/shared/layouts/Dashboard";
import {useGetRevenueQuery, useGetTotalPurchaseQuery} from "@/services/dashboard/dashboardApi";
import {toast} from "react-hot-toast";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const Card = ({children, className, ...props}) => (
    <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
        {children}
    </div>
)

const CardContent = ({children, className, ...props}) => (
    <div className={`p-6 ${className}`} {...props}>
        {children}
    </div>
)

const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
    },
}

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
        },
    },
    plugins: {
        legend: {
            position: 'top',
        },
    },
}

// const barChartData = {
//     labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
//     datasets: [
//         {
//             label: 'Sales',
//             data: [65, 59, 80, 81, 56, 55, 40],
//             backgroundColor: 'rgba(59, 130, 246, 0.8)',
//         },
//         {
//             label: 'Revenue',
//             data: [28, 48, 40, 19, 86, 27, 90],
//             backgroundColor: 'rgba(147, 197, 253, 0.8)',
//         },
//     ],
// }


const Page = () => {
    const [totalPurchase, setTotalPurchase] = useState(0);
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [bestBrand, setBestBrand] = useState("");
    const [bestBrandPurchase, setBestBrandPurchase] = useState(0);
    const [lineChart, setLineChart] = useState(null);
    const [barChart, setBarChart] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('Month');
    const {data: purchaseData, error: purchaseError, isLoading: purchaseLoading} = useGetTotalPurchaseQuery();
    const {data: revenueData, error: revenueError, isLoading: revenueLoading} = useGetRevenueQuery(selectedPeriod);

    const handleClick = (period) => {
        setSelectedPeriod(period);
    };


    useEffect(() => {
        if (purchaseLoading) {
            toast.loading("Fetching total purchases...", {id: "totalPurchase"});
        }
        if (purchaseData) {
            setTotalPurchase(purchaseData.data.totalPurchase);
            setTotalPurchaseAmount(purchaseData.data.totalAmount);
            setTotalProduct(purchaseData.data.totalProduct);
            setTotalUser(purchaseData.data.totalUser);
            setBestBrand(purchaseData.data.bestBrand);
            setBestBrandPurchase(purchaseData.data.bestBrandPurchase);

            const products = purchaseData.data.ranking;
            const barChartData = {
                labels: products.map(product => product.productName), // X-axis labels (product names)
                datasets: [
                    {
                        label: 'Total Quantity Sold', // Dataset label
                        data: products.map(product => product.totalQuantity), // Data for the chart (totalQuantity)
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Set a color for the bars
                        borderColor: 'rgba(75, 192, 192, 1)', // Set a border color for the bars
                        borderWidth: 0.4 // Set the border width
                    }
                ]
            };
            setBarChart(barChartData);

            toast.success(purchaseData?.description, {id: "totalPurchase"});
        }
        if (purchaseError) {
            toast.error(purchaseError?.data?.description, {id: "totalPurchase"});
        }
        // console.log("test");
    }, [purchaseData, purchaseError, purchaseLoading]);

    useEffect(() => {
        // if (revenueLoading) {
        //     toast.loading("Fetching revenue data...", {id: "revenueData"});
        // }
        if (revenueError) {
            toast.error(revenueError?.data?.description, {id: "revenueData"});
        }
        if (revenueData) {
            const revenueDataBefore = revenueData.data.last7DaysRevenue;
            const revenueDataLast = revenueData.data.previous7DaysRevenue;
            const last7Days = revenueDataBefore.slice(selectedPeriod === 'Week' ? -7 : -30);
            const labels = last7Days.map(entry => entry.date); // Dates as labels
            const dataValues = last7Days.map(entry => entry.totalRevenue); // Revenue amounts

            const lineChartData = {
                labels,
                datasets: [
                    {
                        label: selectedPeriod === 'Week' ? "This Week" : "This Month",
                        data: dataValues,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4, // Smooth line
                    },
                    {
                        label: selectedPeriod === 'Week' ? "Last Week" : "Last Month",
                        data: revenueDataLast.map(entry => entry.totalRevenue),
                        borderColor: 'rgb(147, 197, 253)',
                        backgroundColor: 'rgba(147, 197, 253, 0.5)',
                        tension: 0.4, // Smooth line

                    }
                ],
            };
            setLineChart(lineChartData);
        }
        // console.log("test");

    }, [selectedPeriod, revenueData, revenueError, revenueLoading]);


    return (
        <Dashboard>
            <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Views Card */}
                    <Card>
                        <CardContent>
                            <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                                <Eye className="w-6 h-6 text-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">{totalPurchaseAmount.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                })}</h2>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-500">Total purchases</p>
                                    <span className="text-green-500 text-sm">{totalPurchase}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Card */}
                    <Card>
                        <CardContent>
                            <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-6 h-6 text-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">{totalProduct}</h2>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-500">Total Product</p>
                                    {/*<span className="text-green-500 text-sm">2.59% ↑</span>*/}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/*Users Card*/}
                    <Card>
                        <CardContent>
                            <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                                <ShoppingCart className="w-6 h-6 text-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">{bestBrandPurchase.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                })}</h2>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-500">Best Brand</p>
                                    <span className="text-green-500 text-sm">{bestBrand}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profit Card */}
                    <Card>
                        <CardContent>
                            <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">{totalUser}</h2>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-500">Total User</p>
                                    {/*<span className="text-green-500 text-sm">4.35% ↑</span>*/}
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2">
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-600"/>
                                            <span>Total Revenue</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-300"/>
                                            <span>Total Revenue last</span>
                                        </div>
                                    </div>
                                    {/*<p className="text-sm text-gray-500">12.04.2022 - 12.05.2022</p>*/}
                                </div>

                                <div className="flex gap-2">
                                    {/*<button*/}
                                    {/*    className={`px-3 py-1 rounded-lg ${selectedPeriod === 'Day' ? 'bg-blue-500 text-white' : 'bg-white'}`}*/}
                                    {/*    onClick={() => handleClick('Day')}*/}
                                    {/*>*/}
                                    {/*    Day*/}
                                    {/*</button>*/}
                                    <button
                                        className={`px-3 py-1 rounded-lg ${selectedPeriod === 'Week' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                        onClick={() => handleClick('Week')}
                                    >
                                        Week
                                    </button>
                                    <button
                                        className={`px-3 py-1 rounded-lg ${selectedPeriod === 'Month' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                        onClick={() => handleClick('Month')}
                                    >
                                        Month
                                    </button>
                                </div>

                            </div>
                            <div className="h-[300px]">
                                {lineChart ? (
                                    <Line options={lineChartOptions} data={lineChart}/>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Profit Chart */}
                    <Card>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Product Ranking</h3>
                                {/*<select className="text-sm border rounded-md px-2 py-1">*/}
                                {/*    <option>This Week</option>*/}
                                {/*    <option>Last Week</option>*/}
                                {/*</select>*/}
                            </div>
                            <div className="h-[300px]">
                                {barChart ? (
                                    <Bar options={barChartOptions} data={barChart}/>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Dashboard>
    )
}

export default Page
