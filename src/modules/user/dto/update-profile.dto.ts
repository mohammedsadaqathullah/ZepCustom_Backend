import { IsString, IsUrl, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    displayName?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    avatarConfig?: any;
}
