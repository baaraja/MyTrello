import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/dto/signupDto';
import { SigninDto } from 'src/dto/signinDto';
import { ResetPasswordDemandDto } from 'src/dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from 'src/dto/resetPasswordConfirmationDto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from 'src/dto/deleteAccountDto';

@Controller('u')
export class AuthController {
    @Get()
    getAll() {
        return this.authService.getAll();
    }
    constructor(private readonly authService: AuthService) {}
    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }
    @Post('signin')
    async signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }
    @Post('reset-password')
    async resetPasswordDemand(@Body() resetPasswordDemandDto: ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDemandDto);
    }
    @Post('reset-password-confirmation')
    async resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    deleteAccount(@Req() request : Request, @Body() deleteAccountDto : DeleteAccountDto) {
        const userId = request.user['userId'];  
        return this.authService.deleteAccount(userId, deleteAccountDto);
    }
}
