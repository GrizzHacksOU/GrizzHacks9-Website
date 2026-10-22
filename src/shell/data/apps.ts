import type { AppDef } from "../types/app";

export const APPS: AppDef[] = [
    {
        id: 'template',
        title: 'Template',
        icon: '/shared/assets/placeholder-icon.png',
        url: '/apps/_template/index.html'
    },
    {
        id: 'registration',
        title: 'Register for GrizzHacks',
        icon: '/shared/assets/register-icon.png',
        url: '/apps/registration/index.html'
    },
    {
        id: 'about-us',
        title: 'About GrizzHacks',
        icon: '/shared/assets/aboutUs-icon.png',
        url: '/apps/about-us/index.html'
    },
    {
        id: 'schedule',
        title: 'Schedule',
        icon: '/shared/assets/schedule-icon.png',
        url: '/apps/schedule/index.html'
    },
    {
        id: 'tracks',
        title: 'Tracks',
        icon: '/shared/assets/tracks-icon.png',
        url: '/apps/tracks/index.html'
    },
    {
        id: 'sponsors',
        title: 'Sponsors',
        icon: '',
        url: ''
    },
    {
        id: 'faq',
        title: 'F.A.Q.',
        icon: '/shared/assets/faq-icon.png',
        url: '/apps/faq/index.html'
    },
    {
        id: 'team',
        title: 'Team',
        icon: '/shared/assets/team-icon.png',
        url: '/apps/team/index.html'
    },
];
