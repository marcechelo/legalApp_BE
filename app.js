const express           = require('express');
const app               = express();
const userRoutes        = require('./routes/userRoutes');
const catalogueRoutes   = require('./routes/catalogueRoutes');
//const PORT = 3000;

app.use(express.json());
app.use('/user', userRoutes);
app.use('/catalogue', catalogueRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`)
});