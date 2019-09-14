import { Controller, Post, Body, Res, Response } from "@nestjs/common";
import { Credentials, User, UserTypes } from '@complaint-logger/models';
import * as request from 'request';
import { environment } from '../../environments/environment';
@Controller('users')
export class UsersController {
    @Post('login')
    login(@Response() res, @Body() user: User) {
        const options = {
            method: 'POST',
            url: `${environment.gnduApiBase}/ValidateMsg`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                LoginID: user.loginId,
                Password: user.password,
                UserType: this.userTypeString(user.type)
            }
        };

        request(options, (err, response, body) => {
            if (err) return res.status(401).send({ message: "Invalid Credentials" });
            try {
                const parsedBody = JSON.parse(body);
                if (parsedBody.RespValue === "True") {
                    parsedBody.loginId = user.loginId;
                    console.log(res);
                    switch (user.type) {
                        case UserTypes.Student:
                            return res.send(this.getStudent(parsedBody));
                        case UserTypes.Department:
                            return res.send(this.getDepartment(parsedBody));
                        case UserTypes.Employee:
                            return res.send(this.getEmployee(parsedBody));
                        case UserTypes.Admin:
                            return res.send({ ...this.getEmployee(parsedBody), admin: true });
                        case UserTypes.Technician:
                            return res.send(this.getEmployee(parsedBody));
                    }
                }
                else {
                    res.status(401).send({ message: "Invalid Credentials" });
                }
            } catch (error) {
                console.error('Error');
                console.log(error);
                res.status(401).send(error);
            }
        });
    }

    getDepartment(user: any): User {
        return {
            admin: false,
            loginId: user.loginId,
            name: user.Dept_Name,
            type: UserTypes.Department,
            mobile: user.Dept_MobileNo,
            department: {
                name: user.Dept_Name
            }
        }
    }

    getStudent(user: User): User {
        return {
            admin: false,
            loginId: user.loginId,
            name: user.Student_Name,
            type: UserTypes.Student,
            mobile: user.Student_MobileNo,
            department: {
                name: user.Student_DeptName,
                course_designation: `${user.Student_CourseName} ${user.Student_Semester ? ('(Semester - ' + user.Student_Semester) : ''}`
            }
        }
    }

    getEmployee(user: User): User {
        return {
            admin: false,
            loginId: user.loginId,
            name: user.Emp_Name,
            type: UserTypes.Employee,
            mobile: user.Emp_MobileNo,
            photoUrl: user.Emp_PhotoURL,
            department: {
                name: user.Emp_DeptName,
                course_designation: user.Emp_Designation
            }
        }
    }

    userTypeString(userType: UserTypes) {
        switch (userType) {
            case UserTypes.Student:
                return 'S';
            case UserTypes.Admin:
                return 'A';
            case UserTypes.Employee:
                return 'E';
            case UserTypes.Technician:
                return 'T';
            default:
                return 'D'
        }
    }
}