import app from './src/app.js';
import { ConnectDb } from './src/DB/db.js';
ConnectDb();
const port = process.env.PORT || 3000;
app.listen(`${port}`, () => {
    console.log('Server is Listening at port: 3000');
});
//# sourceMappingURL=server.js.map