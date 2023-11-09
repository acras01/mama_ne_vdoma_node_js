import { Module } from '@nestjs/common';
import { FirebaseFactory } from './firebase.provider';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [
    {
      provide: 'firebase',
      useFactory: FirebaseFactory,
    },
    FirebaseService,
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
