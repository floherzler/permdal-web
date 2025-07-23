import React from "react";

const Layout = async ({
    children,
}: {
    children: React.ReactNode;
    params: { userId: string; userSlug: string };
}) => {
    // const user = await users.get<UserPrefs>(params.userId);

    return (
        <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* <Navbar /> */}
                <div className="w-full">{children}</div>
            </div>
        </div>
    );
};

export default Layout;