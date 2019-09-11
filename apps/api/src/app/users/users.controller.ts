import { Controller, Post, Body, Res, Response } from "@nestjs/common";
import { Credentials, User, UserTypes } from '@complaint-logger/models';
import * as request from 'request';
@Controller('users')
export class UsersController {
    @Post('login')
    login(@Response() res, @Body() user: User) {
        const options = {
            method: 'POST',
            url: 'http://gnduadmissions.org/firstmobileapp_webservice.asmx/ValidateMsg',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                RNo: user.loginId,
                Password: user.password,
                UserType: this.userTypeString(user.type)
            }
        };

        request(options, (err, response, body) => {
            if (err) throw new Error(err);
            try {
                const parsedBody = JSON.parse(body);
                parsedBody.loginId = user.loginId;
                console.log(res);
                switch (user.type) {
                    case UserTypes.Student:
                        return res.send(this.getStudent(parsedBody));
                    case UserTypes.Admin:
                        return res.send(this.getAdmin(parsedBody));
                }
            } catch (error) {
                console.error('Error');
                console.log(error);
                res.status(400).send(error);
            }
        });
    }
    getAdmin(user: any): User {
        return user;
    }

    getStudent(user: User): User {
        return {
            admin: false,
            loginId: user.loginId,
            name: user.Student_Name,
            type: UserTypes.Student,
            mobile: user.Student_MobileNo
        }
    }

    userTypeString(userType: UserTypes) {
        switch (userType) {
            case UserTypes.Student:
                return 'S';
            case UserTypes.Admin:
                return 'D';
            case UserTypes.Hostler:
                return 'H';
            case UserTypes.Technician:
                return 'E';
            default:
                return 'R'
        }
    }
}