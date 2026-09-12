<?php

use App\Models\Page;

if (! function_exists('page_public_url')) {
    /**
     * Return the public URL path for a CMS page.
     */
    function page_public_url(Page $page): string
    {
        return $page->is_home ? '/' : '/'.ltrim($page->slug, '/');
    }
}
