const markers = {
    railway: [
        {
            "city": "Delhi",
            "station_name": "New Delhi Railway Station",
            "station_code": "NDLS",
            "latitude": 28.6134,
            "longitude": 77.2001
        },
        {
            "city": "Mumbai",
            "station_name": "Chhatrapati Shivaji Maharaj Terminus",
            "station_code": "CSMT",
            "latitude": 18.9439,
            "longitude": 72.8359
        },
        {
            "city": "Kolkata",
            "station_name": "Howrah Junction",
            "station_code": "HWH",
            "latitude": 22.5958,
            "longitude": 88.2636
        },
        {
            "city": "Chennai",
            "station_name": "Chennai Central Railway Station",
            "station_code": "MAS",
            "latitude": 13.0820,
            "longitude": 80.2757
        },
        {
            "city": "Bengaluru",
            "station_name": "Krantivira Sangolli Rayanna (Bengaluru) Station",
            "station_code": "SBC",
            "latitude": 12.9784,
            "longitude": 77.5715
        },
        {
            "city": "Hyderabad",
            "station_name": "Hyderabad Deccan Railway Station",
            "station_code": "HYB",
            "latitude": 17.3850,
            "longitude": 78.4867
        },
        {
            "city": "Ahmedabad",
            "station_name": "Ahmedabad Junction",
            "station_code": "ADI",
            "latitude": 23.0225,
            "longitude": 72.5714
        },
        {
            "city": "Pune",
            "station_name": "Pune Junction",
            "station_code": "PUNE",
            "latitude": 18.5204,
            "longitude": 73.8567
        },
        {
            "city": "Jaipur",
            "station_name": "Jaipur Junction",
            "station_code": "JP",
            "latitude": 26.9124,
            "longitude": 75.7873
        },
        {
            "city": "Lucknow",
            "station_name": "Lucknow Charbagh Railway Station",
            "station_code": "LKO",
            "latitude": 26.8467,
            "longitude": 80.9462
        },
        {
            "city": "Bhopal",
            "station_name": "Bhopal Junction",
            "station_code": "BPL",
            "latitude": 23.2599,
            "longitude": 77.4126
        },
        {
            "city": "Indore",
            "station_name": "Indore Junction",
            "station_code": "INDB",
            "latitude": 22.7196,
            "longitude": 75.8577
        },
        {
            "city": "Patna",
            "station_name": "Patna Junction",
            "station_code": "PNBE",
            "latitude": 25.6093,
            "longitude": 85.1235
        },
        {
            "city": "Varanasi",
            "station_name": "Varanasi Junction",
            "station_code": "BSB",
            "latitude": 25.3176,
            "longitude": 82.9739
        },
        {
            "city": "Nagpur",
            "station_name": "Nagpur Junction",
            "station_code": "NGP",
            "latitude": 21.1458,
            "longitude": 79.0882
        },
        {
            "city": "Surat",
            "station_name": "Surat Railway Station",
            "station_code": "ST",
            "latitude": 21.1702,
            "longitude": 72.8311
        },
        {
            "city": "Kanpur",
            "station_name": "Kanpur Central",
            "station_code": "CNB",
            "latitude": 26.4499,
            "longitude": 80.3319
        },
        {
            "city": "Ranchi",
            "station_name": "Ranchi Junction",
            "station_code": "RNC",
            "latitude": 23.3441,
            "longitude": 85.3096
        },
        {
            "city": "Guwahati",
            "station_name": "Guwahati Railway Station",
            "station_code": "GHY",
            "latitude": 26.1445,
            "longitude": 91.7362
        },
        {
            "city": "Chandigarh",
            "station_name": "Chandigarh Railway Station",
            "station_code": "CDG",
            "latitude": 30.7333,
            "longitude": 76.7794
        }
    ],
    cities: [
        { "city": "Delhi", "state": "Delhi", "latitude": 28.7041, "longitude": 77.1025 },
        { "city": "Mumbai", "state": "Maharashtra", "latitude": 19.0760, "longitude": 72.8777 },
        { "city": "Kolkata", "state": "West Bengal", "latitude": 22.5726, "longitude": 88.3639 },
        { "city": "Chennai", "state": "Tamil Nadu", "latitude": 13.0827, "longitude": 80.2707 },
        { "city": "Bengaluru", "state": "Karnataka", "latitude": 12.9716, "longitude": 77.5946 },
        { "city": "Hyderabad", "state": "Telangana", "latitude": 17.3850, "longitude": 78.4867 },
        { "city": "Ahmedabad", "state": "Gujarat", "latitude": 23.0225, "longitude": 72.5714 },
        { "city": "Pune", "state": "Maharashtra", "latitude": 18.5204, "longitude": 73.8567 },
        { "city": "Jaipur", "state": "Rajasthan", "latitude": 26.9124, "longitude": 75.7873 },
        { "city": "Lucknow", "state": "Uttar Pradesh", "latitude": 26.8467, "longitude": 80.9462 },
        { "city": "Bhopal", "state": "Madhya Pradesh", "latitude": 23.2599, "longitude": 77.4126 },
        { "city": "Indore", "state": "Madhya Pradesh", "latitude": 22.7196, "longitude": 75.8577 },
        { "city": "Patna", "state": "Bihar", "latitude": 25.5941, "longitude": 85.1376 },
        { "city": "Varanasi", "state": "Uttar Pradesh", "latitude": 25.3176, "longitude": 82.9739 },
        { "city": "Nagpur", "state": "Maharashtra", "latitude": 21.1458, "longitude": 79.0882 },
        { "city": "Surat", "state": "Gujarat", "latitude": 21.1702, "longitude": 72.8311 },
        { "city": "Kanpur", "state": "Uttar Pradesh", "latitude": 26.4499, "longitude": 80.3319 },
        { "city": "Ranchi", "state": "Jharkhand", "latitude": 23.3441, "longitude": 85.3096 },
        { "city": "Guwahati", "state": "Assam", "latitude": 26.1445, "longitude": 91.7362 },
        { "city": "Chandigarh", "state": "Chandigarh", "latitude": 30.7333, "longitude": 76.7794 }
    ]
};

export default markers;