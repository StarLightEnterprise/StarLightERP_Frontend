import { writable } from 'svelte/store';

export interface Breadcrumb {
    label: string;
    href: string;
}

function createBreadcrumbStore() {
    const { subscribe, set, update } = writable<Breadcrumb[]>([]);

    return {
        subscribe,
        set: (breadcrumbs: Breadcrumb[]) => set(breadcrumbs),
        clear: () => set([]),
        push: (breadcrumb: Breadcrumb) => update(crumbs => [...crumbs, breadcrumb]),
        reset: () => set([])
    };
}

export const breadcrumbs = createBreadcrumbStore();
