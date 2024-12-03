import { IsString, IsNotEmpty } from 'class-validator';

export class IssueDTO {
    @IsString()
    @IsNotEmpty()
    issueName: string;
}
