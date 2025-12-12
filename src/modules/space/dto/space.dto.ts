import { IsString, IsOptional, IsEnum, IsInt, Min, Max, MinLength } from 'class-validator';
import { SpaceVisibility } from '@prisma/client';

export class CreateSpaceDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(SpaceVisibility)
    visibility?: SpaceVisibility;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(500)
    maxCapacity?: number;
}

export class UpdateSpaceDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(SpaceVisibility)
    visibility?: SpaceVisibility;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(500)
    maxCapacity?: number;
}

export class UpdateMapDto {
    mapJson: any; // JSON schema validation would be added here
}
