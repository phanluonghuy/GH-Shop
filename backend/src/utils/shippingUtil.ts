const zipCodes = [
    {
        "id": "100300",
        "name": "Quận Hai Bà Trưng",
        "city_id": "100000"
    },
    {
        "id": "101500",
        "name": "Quận Hà Đông",
        "city_id": "100000"
    },
    {
        "id": "102200",
        "name": "Huyện Đan Phượng",
        "city_id": "100000"
    },
    {
        "id": "102300",
        "name": "Huyện Hoài Đức",
        "city_id": "100000"
    },
    {
        "id": "102500",
        "name": "Huyện Mỹ Đức",
        "city_id": "100000"
    },
    {
        "id": "101800",
        "name": "Huyện Phúc Thọ",
        "city_id": "100000"
    },
    {
        "id": "102000",
        "name": "Huyện Quốc Oai",
        "city_id": "100000"
    },
    {
        "id": "101900",
        "name": "Huyện Thạch Thất",
        "city_id": "100000"
    },
    {
        "id": "102700",
        "name": "Huyện Thường Tín",
        "city_id": "100000"
    },
    {
        "id": "102600",
        "name": "Huyện Ứng Hòa",
        "city_id": "100000"
    },
    {
        "id": "102800",
        "name": "Huyện Phú Xuyên",
        "city_id": "100000"
    },
    {
        "id": "100100",
        "name": "Quận Ba Đình",
        "city_id": "100000"
    },
    {
        "id": "101000",
        "name": "Quận Bắc Từ Liêm",
        "city_id": "100000"
    },
    {
        "id": "101700",
        "name": "Huyện Ba Vì",
        "city_id": "100000"
    },
    {
        "id": "100600",
        "name": "Quận Cầu Giấy",
        "city_id": "100000"
    },
    {
        "id": "101300",
        "name": "Huyện Đông Anh",
        "city_id": "100000"
    },
    {
        "id": "100400",
        "name": "Quận Đống Đa",
        "city_id": "100000"
    },
    {
        "id": "101200",
        "name": "Huyện Gia Lâm",
        "city_id": "100000"
    },
    {
        "id": "100200",
        "name": "Quận Hoàn Kiếm",
        "city_id": "100000"
    },
    {
        "id": "100800",
        "name": "Quận Hoàng Mai",
        "city_id": "100000"
    },
    {
        "id": "100900",
        "name": "Quận Long Biên",
        "city_id": "100000"
    },
    {
        "id": "102900",
        "name": "Huyện Mê Linh",
        "city_id": "100000"
    },
    {
        "id": "103000",
        "name": "Quận Nam Từ Liêm",
        "city_id": "100000"
    },
    {
        "id": "101400",
        "name": "Huyện Sóc Sơn",
        "city_id": "100000"
    },
    {
        "id": "101600",
        "name": "Thị xã Sơn Tây",
        "city_id": "100000"
    },
    {
        "id": "100500",
        "name": "Quận Tây Hồ",
        "city_id": "100000"
    },
    {
        "id": "102400",
        "name": "Huyện Thanh Oai",
        "city_id": "100000"
    },
    {
        "id": "101100",
        "name": "Huyện Thanh Trì",
        "city_id": "100000"
    },
    {
        "id": "100700",
        "name": "Quận Thanh Xuân",
        "city_id": "100000"
    },
    {
        "id": "102100",
        "name": "Huyện Chương Mỹ",
        "city_id": "100000"
    },
    {
        "id": "700100",
        "name": "Quận 1",
        "city_id": "700000"
    },
    {
        "id": "701000",
        "name": "Quận 10",
        "city_id": "700000"
    },
    {
        "id": "700400",
        "name": "Quận 4",
        "city_id": "700000"
    },
    {
        "id": "700500",
        "name": "Quận 5",
        "city_id": "700000"
    },
    {
        "id": "700600",
        "name": "Quận 6",
        "city_id": "700000"
    },
    {
        "id": "700700",
        "name": "Quận 7",
        "city_id": "700000"
    },
    {
        "id": "700800",
        "name": "Quận 8",
        "city_id": "700000"
    },
    {
        "id": "701100",
        "name": "Quận 11",
        "city_id": "700000"
    },
    {
        "id": "701200",
        "name": "Quận 12",
        "city_id": "700000"
    },
    {
        "id": "702000",
        "name": "Huyện Bình Chánh",
        "city_id": "700000"
    },
    {
        "id": "702400",
        "name": "Huyện Cần Giờ",
        "city_id": "700000"
    },
    {
        "id": "702300",
        "name": "Huyện Nhà Bè",
        "city_id": "700000"
    },
    {
        "id": "701600",
        "name": "Quận Bình Thạnh",
        "city_id": "700000"
    },
    {
        "id": "701900",
        "name": "Quận Bình Tân",
        "city_id": "700000"
    },
    {
        "id": "702100",
        "name": "Huyện Củ Chi",
        "city_id": "700000"
    },
    {
        "id": "701300",
        "name": "Quận Gò Vấp",
        "city_id": "700000"
    },
    {
        "id": "702200",
        "name": "Huyện Hóc Môn",
        "city_id": "700000"
    },
    {
        "id": "701700",
        "name": "Quận Phú Nhuận",
        "city_id": "700000"
    },
    {
        "id": "701400",
        "name": "Quận Tân Bình",
        "city_id": "700000"
    },
    {
        "id": "701500",
        "name": "Quận Tân Phú",
        "city_id": "700000"
    },
    {
        "id": "700300",
        "name": "Quận 3",
        "city_id": "700000"
    },
    {
        "id": "720300",
        "name": "Thành Phố Thủ Đức",
        "city_id": "700000"
    },
    {
        "id": "550700",
        "name": "Quận Cẩm Lệ",
        "city_id": "550000"
    },
    {
        "id": "550100",
        "name": "Quận Hải Châu",
        "city_id": "550000"
    },
    {
        "id": "550500",
        "name": "Quận Liên Chiểu",
        "city_id": "550000"
    },
    {
        "id": "550400",
        "name": "Quận Ngũ Hành Sơn",
        "city_id": "550000"
    },
    {
        "id": "550300",
        "name": "Quận Sơn Trà",
        "city_id": "550000"
    },
    {
        "id": "550200",
        "name": "Quận Thanh Khê",
        "city_id": "550000"
    },
    {
        "id": "550600",
        "name": "Huyện Hòa Vang",
        "city_id": "550000"
    }

]

// Function to get the zip code info based on the zip code
export function getZipCodeInfo(zipCode: string) {
    const targetZip = parseInt(zipCode, 10);
    // Tìm zip code gần nhất
    let closestZip = null;
    let closestDistance = Infinity;

    for (const zip of zipCodes) {
        const currentZip = parseInt(zip.id, 10);
        const distance = Math.abs(currentZip - targetZip);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestZip = zip;
        }
    }

    // Trả về id và city_id của zip code gần nhất
    return closestZip ? {id: closestZip.id, city_id: closestZip.city_id} : null;

}

// Export the zip code data if needed elsewhere
export {zipCodes};