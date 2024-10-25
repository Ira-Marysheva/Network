import {IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export default class filterDataPostDto {
    @ApiProperty({ required: false })
    @IsOptional()
    startDate?:Date

    @ApiProperty({ required: false })
    @IsOptional()
    endDate?:Date
}
