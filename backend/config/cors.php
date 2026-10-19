<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_filter(array_merge([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ], array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', '')))))),
    // Tuneles de desarrollo: desactivados en produccion salvo que se definan por env
    'allowed_origins_patterns' => env('CORS_ALLOWED_ORIGIN_PATTERNS') !== null
        ? array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGIN_PATTERNS')))))
        : (env('APP_ENV') === 'production' ? [] : [
            '#https://.*\.lhr\.life#',
            '#https://.*\.serveousercontent\.com#',
            '#https://.*\.trycloudflare\.com#',
        ]),
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
