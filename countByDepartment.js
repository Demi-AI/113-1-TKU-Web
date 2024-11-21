const { MongoClient } = require('mongodb');

// MongoDB 連接設定
const url = 'mongodb://localhost:27017'; // MongoDB 伺服器網址
const dbName = '411631020'; // 資料庫名稱
const collectionName = 'studentlist'; // 集合名稱

async function countByDepartment() {
    const client = new MongoClient(url);

    try {
        // 連接到 MongoDB
        await client.connect();
        console.log("成功連接到 MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 查詢所有學生資料並統計各科系人數
        const departmentStats = await collection.aggregate([
            { $group: { _id: "$院系", count: { $sum: 1 } } }, // 根據院系分組並統計人數
            { $sort: { count: -1 } } // 按照人數降序排列
        ]).toArray();

        console.log("各科系人數統計：");
        if (departmentStats.length > 0) {
            departmentStats.forEach(department => {
                console.log(`${department._id}: ${department.count} 人`);
            });
        } else {
            console.log("沒有有效的科系資料");
        }

    } catch (error) {
        console.error("發生錯誤：", error);
    } finally {
        // 關閉連接
        await client.close();
        console.log("已關閉 MongoDB 連接");
    }
}

// 執行統計
countByDepartment();
