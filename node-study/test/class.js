var teacher = require('./teacher.js'),
	student = require('./student.js');
	//teacher.add('yao');

exports.add = function (className,teacherName,students){
	teacher.add(teacherName);
	students.forEach(function(item,index){
		student.add(item);
	});
	console.log(className);
};

