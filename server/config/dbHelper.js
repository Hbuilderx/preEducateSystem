
const config = require("./config").database
let mysql = require('mysql');
let pool  = mysql.createPool({
    connectionLimit : 10,
    host            : config.host,
    user            : config.user,
    password        : config.password,
    database        : config.database,
    port            : config.port,
});


//创建通用查询方法
let Query=(sql,value)=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err, connection) {
            //链接失败
            if (err) {
                reject({
                    code:0,
                    data:err
                }); // not connected!
            }

            // 链接成功
            connection.query(sql, value ,(error, results, fields)=> {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) {
                    reject({
                        code:0,
                        data:error,
                        msg:"执行失败！"
                    })
                }

                resolve({
                    code:1,
                    data:results,
                    msg:"执行成功！"
                })

                // Don't use the connection here, it has been returned to the pool.
            });
        });
    })
};

module.exports=Query