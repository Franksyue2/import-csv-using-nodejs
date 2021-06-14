var mongoose = require('mongoose');

var Student  = mongoose.model('Students');


const studentService = {
  addStudent: (req) => {
  	var item = new Student({
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
  }
}

module.exports = studentService;