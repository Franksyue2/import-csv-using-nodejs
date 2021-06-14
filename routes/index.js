var express = require('express');
var csv = require("fast-csv");
var router = express.Router();
var fs = require('fs');

var mongoose = require('mongoose');

var Product  = mongoose.model('Products');

var csvfile = __dirname + "/../public/files/products.csv";
var stream = fs.createReadStream(csvfile);

const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Import CSV using NodeJS' });

}).get('/import', function(req, res, next) {

    var  products  = []
    var csvStream = csv()
        .on("data", function(data){
         
         var item = new Product({
              name: data[0] ,
              price: data[1]   ,
              category: data[2],
              description: data[3],
              manufacturer:data[4] 
         });
         
          item.save(function(error){
            console.log(item);
              if(error){
                   throw error;
              }
          }); 

    }).on("end", function(){

    });
  
    stream.pipe(csvStream);
    res.json({success : "Data imported successfully.", status : 200});
     
  }).get('/fetchdata', function(req, res, next) {
    
    Product.find({}, function(err, docs) {
        if (!err){ 
            res.json({success : "Updated Successfully", status : 200, data: docs});
        } else { 
            throw err;
        }
    });
  
});

router.post('/add', upload.single('file'), function (req, res) {
  const fileRows = [];
  // open uploaded file
  // console.log(req)
  // for ( var property in req ) {
  //   console.log( property ); // Outputs: foo, fiz or fiz, foo
  // }
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows);
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      res.json({success : "Updated Successfully", status : 200, data: fileRows});
    })
});

module.exports = router;
