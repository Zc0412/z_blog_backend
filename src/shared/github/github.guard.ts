import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// github guard
@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {}
