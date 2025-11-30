<script>
    // Dummy data for stats
    const stats = [
        {
            label: "Total Students",
            value: "2,543",
            icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
            trend: "+12%",
            trendUp: true,
        },
        {
            label: "Total Teachers",
            value: "142",
            icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
            trend: "+4%",
            trendUp: true,
        },
        {
            label: "Active Classes",
            value: "48",
            icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
            trend: "0%",
            trendUp: true,
        },
        {
            label: "Attendance",
            value: "96%",
            icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
            trend: "-1.2%",
            trendUp: false,
        },
    ];

    const activities = [
        {
            title: "New student registration",
            time: "10 min ago",
            description: "Rahul Kumar registered for Class X-A",
        },
        {
            title: "Fee payment received",
            time: "45 min ago",
            description: "Payment of ₹15,000 received from Priya Singh",
        },
        {
            title: "Teacher meeting scheduled",
            time: "2 hrs ago",
            description: "Staff meeting scheduled for tomorrow at 10 AM",
        },
        {
            title: "Exam results published",
            time: "5 hrs ago",
            description: "Class XII Physics mid-term results are out",
        },
    ];
</script>

<div class="dashboard-home">
    <h1 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem;">
        Welcome back, Upendra!
    </h1>
    <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
        Here's what's happening in your school today.
    </p>

    <div class="dashboard-grid">
        {#each stats as stat}
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            {@html stat.icon}
                        </svg>
                    </div>
                    <div
                        class="stat-trend {stat.trendUp
                            ? 'trend-up'
                            : 'trend-down'}"
                    >
                        {#if stat.trendUp}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"
                                ></polyline><polyline points="17 6 23 6 23 12"
                                ></polyline></svg
                            >
                        {:else}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"
                                ></polyline><polyline points="17 18 23 18 23 12"
                                ></polyline></svg
                            >
                        {/if}
                        {stat.trend}
                    </div>
                </div>
                <div class="stat-value">{stat.value}</div>
                <div class="stat-label">{stat.label}</div>
            </div>
        {/each}
    </div>

    <div class="section-grid">
        <div class="card">
            <div class="card-header">
                <div class="card-title">Recent Activities</div>
                <button
                    style="background: none; border: none; color: var(--color-primary); cursor: pointer;"
                    >View All</button
                >
            </div>
            <div class="activity-list">
                {#each activities as activity}
                    <div class="activity-item">
                        <div
                            style="background: var(--color-bg-lighter); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                style="color: var(--color-text-muted);"
                                ><polyline
                                    points="22 12 18 12 15 21 9 3 6 12 2 12"
                                ></polyline></svg
                            >
                        </div>
                        <div>
                            <div
                                style="font-weight: 500; margin-bottom: 0.25rem;"
                            >
                                {activity.title}
                            </div>
                            <div
                                style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.25rem;"
                            >
                                {activity.description}
                            </div>
                            <div class="activity-time">{activity.time}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-title">Quick Actions</div>
            </div>
            <div class="quick-actions">
                <button class="action-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                        ></path><circle cx="8.5" cy="7" r="4"></circle><line
                            x1="20"
                            y1="8"
                            x2="20"
                            y2="14"
                        ></line><line x1="23" y1="11" x2="17" y2="11"
                        ></line></svg
                    >
                    Add Student
                </button>
                <button class="action-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><line x1="12" y1="1" x2="12" y2="23"></line><path
                            d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                        ></path></svg
                    >
                    Collect Fees
                </button>
                <button class="action-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><rect x="3" y="4" width="18" height="18" rx="2" ry="2"
                        ></rect><line x1="16" y1="2" x2="16" y2="6"></line><line
                            x1="8"
                            y1="2"
                            x2="8"
                            y2="6"
                        ></line><line x1="3" y1="10" x2="21" y2="10"
                        ></line></svg
                    >
                    Create Event
                </button>
                <button class="action-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        ></path><polyline points="22,6 12,13 2,6"
                        ></polyline></svg
                    >
                    Send SMS
                </button>
            </div>
        </div>
    </div>
</div>
