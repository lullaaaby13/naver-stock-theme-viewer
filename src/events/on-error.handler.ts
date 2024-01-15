import { OnEvent } from '@nestjs/event-emitter';

export default class OnErrorEventHandler {
    @OnEvent('error')
    handleError(error: Error) {
        console.error(error);
    }
}
