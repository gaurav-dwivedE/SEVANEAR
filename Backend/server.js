const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config();

const dbConnect = require('./db/db');


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on port ${PORT}`);
});

