const fs = require('fs');
var employees =[];
var departments =[];


module.exports.init = function()
{
    return new Promise((resolve,reject) =>{
    fs.readFile('./data/employees.json', (err, data)=> {
            if (err){
                reject("data not found")
            }

            employees=JSON.parse(data);
            
            fs.readFile('./data/departments.json', (errDept, data1) => {
                if (errDept) {
                    reject("data not found");
                }
            employees = JSON.parse(data);
            departments = JSON.parse(data1);
                resolve("success");
            });

            });
        });
}

module.exports.getAllEmployees= ()=>{
    return new Promise((resolve,reject) =>{
        if(employees.length==0)
        {
            reject("no result");
        }
        else{
            resolve(employees);
        }
     });
}
module.exports.getManagers=()=>{
    return new Promise((resolve,reject) =>{
        if(employees.length==0)
        {
            reject("no result");
        }
        else{
            var newarray=[]
            
            for(let i = 0; i< employees.length; i++){
                if(employees[i].isManager == true){
                    newarray.push(employees[i]);
                }
            }
            if(newarray.length == 0){
                reject("no result");
            }else{
                resolve(newarray);
            }
            
        }
        
     });

}

module.exports.getDepartments=()=>{
    return new Promise((resolve,reject) =>{
        if(departments.length==0)
        {
            reject("no result");
        }
        else{
            resolve(departments);
        }
     });
}
module.exports.getEmployeesByDepartment= function (department1){
    return new Promise((resolve,reject) =>{
        var array1=[];
        for(let i=0;i<employees.length;i++)
        {
            if(employees[i].department==department1)
            {
                array1.push(employees[i]);
            }
        }
        if(array1.length<=0)
        {
            reject("no result");
        }
        else{
            resolve(array1);
        }
     });
}

module.exports.getEmployeesByNum= function (Num1){
    return new Promise((resolve,reject) =>{
        var array2=[];
        for(let i=0;i<employees.length;i++)
        {
            if(employees[i].employeeNum==Num1)
            {
                array2.push(employees[i]);
            }
        }
        if(array2.length<=0)
        {
            reject("no result");
        }
        else{
            resolve(array2);
        }
     });
}



module.exports.addEmployee=(employee)=>{
    console.log("this is employee object > > > > ", employee);
    return new Promise((resolve, reject) =>{
        let updateData = employees;
        employee['employeeNum'] = updateData.length + 1;
        if(typeof employee['isManager'] !== undefined && employee['isManager'] === 'on') {
            employee['isManager'] = true;
        } else {
            employee['isManager'] = false;
        }
        updateData.push(employee)
        
        fs.writeFile('./data/employees.json', JSON.stringify(updateData), function(err, data) {
            if (err) {
                reject("Error in saving file", err);
            }
            console.log('Done! > > > > > ');
            resolve(data);
        });
    });
}

module.exports.updateEmployee = function (data){
    return new Promise((resolve,reject) =>{
        var findEmployee = false;

        for(let i=0;i<employees.length;i++){

            if(employees[i].firstName == data.firstName){
                employees[i].firstName = data.firstName;
                employees[i].lastName = data.lastName
                employees[i].email = data.email
                employees[i]['SSN'] = data['SSN']
                employees[i].addressStreet = data.addressStreet
                employees[i].addressCity = data.addressCity
                employees[i].addressState = data.addressState
                employees[i].addressPostal = data.addressPostal
                employees[i].employeeManagerNum = data.employeeManagerNum
                employees[i].department = data.department
                employees[i].hireDate = data.hireDate
                employees[i].isManager = typeof data.isManager !== "undefined" ? false : data.isManager;
                findEmployee = true;
            }
        }
        if(findEmployee === false){
            reject("no result");
        }
        else{
            resolve(findEmployee);
        }
     });
}

module.exports.getDepartmentsByNum = function (Num1){
    return new Promise((resolve,reject) =>{
        var deptArr=[];
        for(let i=0;i < departments.length;i++)
        {
            if(departments[i].departmentId==Num1)
            {
                deptArr.push(departments[i]);
            }
        }
        if(deptArr.length<=0){
            reject("no result");
        }
        else{
            resolve(deptArr);
        }
     });
}