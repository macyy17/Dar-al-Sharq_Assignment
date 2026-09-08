<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Dar Al Sharq CMS API',
    description: 'API documentation for the CMS assignment.'
)]
#[OA\Server(url: '/api', description: 'Application API')]
final class Documentation
{
}
