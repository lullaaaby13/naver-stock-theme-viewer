import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ErrorEvent } from './model';

@Injectable()
export default class OnErrorEventHandler {
    @OnEvent('error')
    handleError(payload: ErrorEvent) {
        console.error(payload.error);
    }
}
