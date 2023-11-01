import { NotFoundException } from '@nestjs/common';

export const checkResponseForParentsIds = (response, requiredIds) => {
  const responseIds = response.map((item) => item._id.toString());

  for (const id of requiredIds) {
    if (!responseIds.includes(id)) {
      throw new NotFoundException(`Parent ID ${id} not found`);
    }
  }
};

export const checkResponseForChildrensIds = (response, requiredIds) => {
  const responseIds = response.map((item) => item._id.toString());

  for (const id of requiredIds) {
    if (!responseIds.includes(id)) {
      throw new NotFoundException(`Child ID ${id} not found`);
    }
  }
};
