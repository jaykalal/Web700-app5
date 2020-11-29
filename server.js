/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Jay Kalal Student ID: ______________ Date: 13/11/2020
*
********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');
var serverDataModule = require('./modules/serverDataModule');
var bodyParser = require('body-parser')
const exphbs = require("express-handlebars");

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/', express.static(__dirname + 'public/'))
app.engine(".hbs", exphbs({
    extname: ".hbs",
    helpers: {
        navLink: function (url, options) {
            // console.log('this is URL > > > ', url, options)
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set("view engine", ".hbs");


// app.get("/",(req,res)=>{
//     res.sendFile(path.join(__dirname,"views/home.html"))
// });
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
app.get("/", (req, res) => {
    res.render("home", {
        data: {},
        dataArr: {},
    })
});


app.get("/about", (req, res) => {
    res.render("about", {
        
    });
});
// app.get("/about",(req,res)=>{
//     res.sendFile(path.join(__dirname,"views/about.html"))
// });
app.get("/htmlDemo",(req,res)=>{
    res.sendFile(path.join(__dirname,"views/htmlDemo.html"))
});

app.get("/employees/getform", (req,res) => {
    res.sendFile(path.join(__dirname,"views/addEmployee.html"))
});

app.post("/employees/add", (req, res)=> {
    if(req.body) {
        serverDataModule.addEmployee(req.body).then((successData) => {
            res.redirect("http://localhost:8080/employees");
        }).catch((err) => {
            res.send({Message : err})
        });
    }
});


app.get("/employees", (req, res) => {
    var depVal = req.query.department;
    if(depVal > 0){
        serverDataModule.getEmployeesByDepartment(depVal).then((data1) => {
            var jsonString = JSON.stringify(data1);
            // res.send(jsonString);
            res.render("employees",{
                employees: jsonString,
            });
        }).catch((err) => {
            res.send({message: err});
        });
        
    }else{
        serverDataModule.getAllEmployees().then((data) => {
            var jsonString = JSON.stringify(data);
            // res.send(jsonString);
            res.render("employees",{
                employees: data,
            });
        }).catch(() => {
            res.send({message: "no results"});
        });
    }
});

app.get("/managers", (req, res) => {
    serverDataModule.getManagers().then((data) => {
        var jsonString = JSON.stringify(data);
        res.send(jsonString);
    }).catch(() => {
        res.send({message: "no results"});
    });
});

app.get("/departments", (req, res) => {
    serverDataModule.getDepartments().then((data) => {
        res.render("departments", {
            departments: data
        });
    }).catch((error) => {
        res.render("departments", {
            departments: "no results"
        });
    });
});

app.get("/employees/:num", (req, res) => {
    var paramVal = req.params.num;
    if(paramVal <= 0){
        res.send({message: "no results"});
    }else{
        serverDataModule.getEmployeesByNum(paramVal).then((data) => {
           // var jsonString = JSON.stringify(data);
            res.render("employee", { employee: data })
        }).catch(() => {
            res.render("employee", { employee: "No Results" })
            //res.send({message: "no results"});
        });
    }
});
app.get("/department/:num", (req, res) => {
    var paramVal = req.params.num;
    if (paramVal <= 0) {
        res.send({ message: "no results" });
    } else {
        serverDataModule.getDepartmentsByNum(paramVal).then((data) => {
            console.log('data > ',data)
            res.render("department", { 
                department: data 
            });
            // res.send(jsonString);
        }).catch(() => {
            res.render("department", { 
                department: "no results" 
            });
        });
    }
});

app.post("/employee/update", (req, res) => {
    var abc = req.body;
    
    serverDataModule.updateEmployee(abc).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        console.log('err > > >', err);
        res.redirect("/");
    });
   
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

serverDataModule.init().then(() => {
    app.listen(HTTP_PORT,()=>{console.log("server is listening on " + HTTP_PORT)});
}).catch(() => {
    console.log(err);
});

// setup http server to listen on HTTP_PORT
