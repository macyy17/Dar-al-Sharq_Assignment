import api from '../../api/client';

export default class LaravelUploadAdapter {
    constructor(loader) {
        this.loader = loader;
        this.controller = new AbortController();
    }

    async upload() {
        const file = await this.loader.file;
        const formData = new FormData();
        formData.append('upload', file);

        const { data } = await api.post('/editor/images', formData, {
            signal: this.controller.signal,
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (event) => {
                if (event.total) {
                    this.loader.uploadTotal = event.total;
                    this.loader.uploaded = event.loaded;
                }
            },
        });

        return { default: data.url };
    }

    abort() {
        this.controller.abort();
    }
}
