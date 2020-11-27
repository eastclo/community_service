const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    //수정 요망 
    mongoose.connect('mongodb://이름:비밀번호@localhost:8001/admin', {  //임시
        dbName: 'nodejs',
        useNewUrlParser: true,
        useCreateIndex: true,
    }, (error) => {
        if(error) {
            console.log('몽고디비 연결 에러', error);
        } else {
            console.log('몽고디비 연결 성공');
        }
    });
};

mongoose.connection.on('error',(error) => {
    console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;