var express = require('express');
var csv = require("fast-csv");
var router = express.Router();
var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) {
  log_file.write(d + '\n');
  log_stdout.write(d + '\n');
};

var mongoose = require('mongoose');

var Student  = mongoose.model('Student');
var StreamModel  = mongoose.model('WSStream');

var csvfile = __dirname + "/../public/files/products.csv";
var stream = fs.createReadStream(csvfile);

const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });
const apikey = "6609d774c3fa3fdbe70cf240b2c9c969";
/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Import CSV using NodeJS' });

}).get('/fetchStudentData', function(req, res, next) {
    
    Student.find({}, function(err, docs) {
        if (!err){ 
            res.json({success : "Fetch Successfully", status : 200, data: docs});
        } else { 
            throw err;
        }
    });
  
});

router.post('/add', upload.single('file'), function (req, res) {
  const fileRows = [];
  var fileType = "A";
  // open uploaded file
  // console.log(req)
  // for ( var property in req ) {
  //   console.log( property ); // Outputs: foo, fiz or fiz, foo
  // }
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      if(data[1] == 'Status') {
        fileType = 'A';
      } else if(data[1] == 'Department') {
        fileType = 'D';
      } else {
        fileRows.push(data); // push each row
      }
    })
    .on("end", function () {
      fs.unlinkSync(req.file.path);   // remove temp file
      //process "fileRows" and respond
      fileRows.forEach(row => {
        var student_id = row[0];
        Student.findOne({student_id: student_id, api_called: false}, function( err, doc){
            if (err){
                console.log(err);
            }
            var course;
            if(doc) {
              if(fileType == 'A') {
                if(doc['department'] == 'Business') {
                  course = 'BUS1010';
                } else if(doc['department'] == 'Engineering') {
                  course = 'ENG1010';
                }else if(doc['department'] == 'Arts and Sciences') {
                  course = 'SCI1010';
                }
                Student.findOneAndUpdate(
                  {student_id: student_id},
                  {
                    status: row[1],
                    application_date: row[2],
                    course: course
                  },
                  {new: false},
                  function(err, doc){
                    //console.log("doc&&&&");
                    //console.log(doc);
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        message: 'Could not update student'
                      });
                    }
                });

                var log_item = {
                  student_id: student_id,
                  status: row[1],
                  application_date: row[2],
                  department: doc['department'],
                  course: course
                };

                //call api in an async way and update api_called after that
                var streamItem = new StreamModel({
                  stream_type: "abc_type",
                  stream_key: "abc_key",
                  stream_data: log_item,
                  is_processed: false,
                  createdAt: new Date().toISOString(),
                  process_timestamp: null,
                  is_duplicated: false
                });

                streamItem.save(function(err, streamItem) {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      message: 'Could not save streamItem'
                    });
                  }
                });

                log_item['api_called'] = false;
                // console.log(JSON.stringify(log_item));
                // process.exit();
              } else {
                if(row[1] == 'Business') {
                  course = 'BUS1010';
                } else if(row[1] == 'Engineering') {
                  course = 'ENG1010';
                }else if(row[1] == 'Arts and Sciences') {
                  course = 'SCI1010';
                }
                Student.findOneAndUpdate(
                  {student_id: student_id},
                  {
                    department: row[1],
                    course: course
                  },
                  {new: false},
                  function(err, doc){
                    //console.log("doc&&&&");
                    //console.log(doc);
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        message: 'Could not update student'
                      });
                    }
                });
                var log_item = {
                  student_id: student_id,
                  status: doc['status'],
                  application_date: doc['application_date'],
                  department: row[1],
                  course: course
                };
                //call api in an async way and update api_called after that
                //call api in an async way and update api_called after that
                var streamItem = new StreamModel({
                  stream_type: "abc_type",
                  stream_key: "abc_key",
                  stream_data: log_item,
                  is_processed: false,
                  createdAt: new Date().toISOString(),
                  process_timestamp: null,
                  duplicated: false
                });

                log_item['api_called'] = false;
                streamItem.save(function(err, streamItem) {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      message: 'Could not save streamItem'
                    });
                  }
                });

                console.log(JSON.stringify(log_item));
              }
            } else {
              var item;
              if(fileType == 'A') {
                item = new Student({
                   student_id: row[0],
                   status: row[1],
                   application_date: row[2]
                });
              } else {
                item = new Student({
                   student_id: row[0],
                   department: row[1]
                });
              }
              item.save(function(error){
                if(error){
                  throw error;
                }
              }); 
            }
        }); 
        
      });
      res.json({success : "Updated Successfully", status : 200, data: fileRows});
    })
});


router.post('/stream/process', function(req, res, next) {
  var decoded = JSON.parse(Buffer.from(req.body.data, 'base64').toString());     
  if(req.body.apikey != apikey) {
      return res.status(500).json({
          message: 'Could not process streams'
      });
  }

  // make the api call...
  // make the api call...
  // make the api call...
  // make the api call...
  // make the api call...

  Student.findOneAndUpdate(
    {student_id: decoded.stream_data.student_id, api_called: false},
    {
      api_called: true
    },
    {new: true},
    function(err, doc){
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Could not update student\' api_called'
        });
      }
      console.log(JSON.stringify(doc));
  });
  
  res.json({success : "Updated Successfully", status : 200, data: {"processed": true}});
});

module.exports = router;
