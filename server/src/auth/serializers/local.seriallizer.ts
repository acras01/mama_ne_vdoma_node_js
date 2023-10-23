import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Parent } from 'src/parent/models/parent.model';
import { DocumentType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(parent: DocumentType<Parent>, done: CallableFunction) {
    done(null, { id: parent.id, email: parent.email });
  }

  async deserializeUser({ id, email }, done: CallableFunction) {
    done(null, { id, email });
  }
}
