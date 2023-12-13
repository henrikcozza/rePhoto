interface FileObject {
    name: string;
    bucket_id: string;
    owner: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
}

export type RestoredImage = FileObject;