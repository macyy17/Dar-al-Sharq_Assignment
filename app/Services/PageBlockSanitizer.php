<?php

namespace App\Services;

class PageBlockSanitizer
{
    private const TYPES = [
        'carousel', 'image_text', 'cta', 'gallery', 'video',
        'accordion', 'cards', 'quote', 'divider', 'button',
    ];

    public function sanitize(array $blocks): array
    {
        return collect($blocks)
            ->filter(fn ($block) => is_array($block) && in_array($block['type'] ?? '', self::TYPES, true))
            ->map(fn (array $block) => $this->sanitizeBlock($block))
            ->values()
            ->all();
    }

    private function sanitizeBlock(array $block): array
    {
        $type = $block['type'];
        $base = ['id' => $this->id($block['id'] ?? null), 'type' => $type];

        return match ($type) {
            'carousel' => $base + [
                'slides' => $this->items($block['slides'] ?? [], fn ($item) => [
                    'id' => $this->id($item['id'] ?? null),
                    'image' => $this->image($item['image'] ?? ''),
                    'icon' => $this->icon($item['icon'] ?? ''),
                    'title' => $this->text($item['title'] ?? '', 180),
                    'caption' => $this->text($item['caption'] ?? '', 500),
                    'url' => $this->url($item['url'] ?? ''),
                ]),
            ],
            'image_text' => $base + [
                'image' => $this->image($block['image'] ?? ''),
                'position' => in_array($block['position'] ?? '', ['left', 'right'], true) ? $block['position'] : 'left',
                'heading' => $this->text($block['heading'] ?? '', 180),
                'description' => $this->text($block['description'] ?? '', 2500),
                'button_text' => $this->text($block['button_text'] ?? '', 80),
                'button_url' => $this->url($block['button_url'] ?? ''),
            ],
            'cta' => $base + [
                'heading' => $this->text($block['heading'] ?? '', 180),
                'description' => $this->text($block['description'] ?? '', 1500),
                'button_text' => $this->text($block['button_text'] ?? '', 80),
                'button_url' => $this->url($block['button_url'] ?? ''),
            ],
            'gallery' => $base + [
                'images' => $this->items($block['images'] ?? [], fn ($item) => [
                    'id' => $this->id($item['id'] ?? null),
                    'image' => $this->image($item['image'] ?? ''),
                    'caption' => $this->text($item['caption'] ?? '', 500),
                ]),
            ],
            'video' => $base + [
                'url' => $this->videoUrl($block['url'] ?? ''),
                'title' => $this->text($block['title'] ?? '', 180),
                'caption' => $this->text($block['caption'] ?? '', 500),
            ],
            'accordion' => $base + [
                'items' => $this->items($block['items'] ?? [], fn ($item) => [
                    'id' => $this->id($item['id'] ?? null),
                    'question' => $this->text($item['question'] ?? '', 300),
                    'answer' => $this->text($item['answer'] ?? '', 4000),
                ]),
            ],
            'cards' => $base + [
                'heading' => $this->text($block['heading'] ?? '', 180),
                'items' => $this->items($block['items'] ?? [], fn ($item) => [
                    'id' => $this->id($item['id'] ?? null),
                    'image' => $this->image($item['image'] ?? ''),
                    'icon' => $this->icon($item['icon'] ?? ''),
                    'title' => $this->text($item['title'] ?? '', 180),
                    'description' => $this->text($item['description'] ?? '', 1200),
                    'url' => $this->url($item['url'] ?? ''),
                ]),
            ],
            'quote' => $base + [
                'quote' => $this->text($block['quote'] ?? '', 2500),
                'author' => $this->text($block['author'] ?? '', 180),
            ],
            'divider' => $base + [
                'size' => in_array($block['size'] ?? '', ['sm', 'md', 'lg'], true) ? $block['size'] : 'md',
            ],
            'button' => $base + [
                'text' => $this->text($block['text'] ?? '', 80),
                'url' => $this->url($block['url'] ?? ''),
                'target' => ($block['target'] ?? '') === 'new' ? 'new' : 'same',
                'style' => ($block['style'] ?? '') === 'secondary' ? 'secondary' : 'primary',
            ],
        };
    }

    private function items(mixed $items, callable $map): array
    {
        if (! is_array($items)) return [];

        return collect($items)
            ->filter(fn ($item) => is_array($item))
            ->take(30)
            ->map($map)
            ->values()
            ->all();
    }

    private function id(mixed $value): string
    {
        $value = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) $value);
        return substr($value ?: uniqid('block_', true), 0, 80);
    }

    private function text(mixed $value, int $max): string
    {
        return mb_substr(trim(strip_tags((string) $value)), 0, $max);
    }

    private function icon(mixed $value): string
    {
        $allowed = ['star', 'globe', 'shield', 'briefcase', 'users', 'newspaper', 'sparkles'];
        $value = strtolower(trim((string) $value));
        return in_array($value, $allowed, true) ? $value : '';
    }

    private function image(mixed $value): string
    {
        $url = trim((string) $value);
        if ($url === '') return '';
        if (str_starts_with($url, '/storage/')) return $url;
        return $this->httpUrl($url);
    }

    private function url(mixed $value): string
    {
        $url = trim((string) $value);
        if ($url === '') return '';
        if (str_starts_with($url, '/') || str_starts_with($url, '#')) return $url;
        if (preg_match('/^(mailto:|tel:)/i', $url)) return $url;
        return $this->httpUrl($url);
    }

    private function videoUrl(mixed $value): string
    {
        $url = $this->httpUrl(trim((string) $value));
        if ($url === '') return '';
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $host = preg_replace('/^www\./', '', $host);
        return in_array($host, ['youtube.com', 'youtu.be', 'vimeo.com', 'player.vimeo.com'], true) ? $url : '';
    }

    private function httpUrl(string $url): string
    {
        if (! filter_var($url, FILTER_VALIDATE_URL)) return '';
        return in_array(strtolower((string) parse_url($url, PHP_URL_SCHEME)), ['http', 'https'], true) ? $url : '';
    }
}
