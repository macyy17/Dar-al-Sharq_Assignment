import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    Autoformat,
    BlockQuote,
    Bold,
    ClassicEditor,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
} from 'ckeditor5';
import LaravelUploadAdapter from './LaravelUploadAdapter';
import 'ckeditor5/ckeditor5.css';

function LaravelUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new LaravelUploadAdapter(loader);
}

const editorConfig = {
    licenseKey: import.meta.env.VITE_CKEDITOR_LICENSE_KEY || 'GPL',
    plugins: [
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Link,
        List,
        BlockQuote,
            Indent,
            Table,
        TableToolbar,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
            Autoformat,
        PasteFromOffice,
    ],
    extraPlugins: [LaravelUploadAdapterPlugin],
    toolbar: {
        items: [
            'undo', 'redo', '|',
            'heading', '|',
            'bold', 'italic', 'link', '|',
            'bulletedList', 'numberedList', '|',
            'outdent', 'indent', '|',
            'blockQuote', 'insertTable', 'uploadImage',
        ],
        shouldNotGroupWhenFull: false,
    },
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        ],
    },
    image: {
        toolbar: ['imageTextAlternative', 'toggleImageCaption', '|', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
    },
};

export default function PageContentEditor({ value, onChange }) {
    return <div className="page-editor rounded-2xl border border-slate-200 bg-white">
        <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={value || ''}
            onChange={(_, editor) => onChange(editor.getData())}
        />
    </div>;
}
