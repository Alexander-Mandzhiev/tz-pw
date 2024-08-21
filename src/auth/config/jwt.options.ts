import { ConfigService } from "@nestjs/config"
import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt"

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get("JWT_ACCESS_TOKEN"),
    signOptions: {
        expiresIn: config.get("ACCESS_JWT_EXPIRATION_TIME")
    }
})

export const options = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => jwtModuleOptions(config),
})