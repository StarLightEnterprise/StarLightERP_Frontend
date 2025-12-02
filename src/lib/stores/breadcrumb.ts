import { writable } from 'svelte/store';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

function createBreadcrumbStore() {
    const { subscribe, set, update } = writable<BreadcrumbItem[]>([]);

    return {
        subscribe,
        set: (items: BreadcrumbItem[]) => set(items),
        reset: () => set([]),
        clear: () => set([])
    };
}

export const breadcrumbs = createBreadcrumbStore();
