var express = require('express');
var cors = require('cors');
require('dotenv').config()
let bodyParser = require('body-parser');
var app = express();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    //console.log(req)
    res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({extended: false}));


app.use(function middleware(req, res, next) {
       next();
}
       );

app.post('/api/fileanalyse',upload.single('upfile'),  function (req,res, next){
  console.log(`req.body: ${JSON.stringify(req.body)}`);
  console.log(`req.params: ${JSON.stringify(req.params)}`);
  console.log(`req.query: ${JSON.stringify(req.file)}`);
  
const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log(file.fieldname + "  " + file.mimetype + (Number(file.size)/8))
    return res.json({
      name: file.originalname,
      type: file.mimetype,
      size: (Number(file.size)/8)
    })
  

  
}
        );

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
