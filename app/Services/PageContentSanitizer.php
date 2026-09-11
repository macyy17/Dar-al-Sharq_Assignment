<?php

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class PageContentSanitizer
{
    private HtmlSanitizer $sanitizer;

    public function __construct()
    {
        $config = (new HtmlSanitizerConfig())
            ->allowSafeElements()
            ->allowRelativeLinks()
            ->allowLinkSchemes(['http', 'https', 'mailto', 'tel'])
            ->allowRelativeMedias()
            ->allowMediaSchemes(['http', 'https'])
            ->allowElement('figure', ['class'])
            ->allowElement('table', ['class'])
            ->allowElement('img', ['src', 'alt', 'width', 'height'])
            ->allowElement('a', ['href', 'title', 'target', 'rel'])
            ->withMaxInputLength(500000);

        $this->sanitizer = new HtmlSanitizer($config);
    }

    public function sanitize(?string $html): string
    {
        return $this->sanitizer->sanitize($html ?? '');
    }
}
