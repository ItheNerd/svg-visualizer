import { ModeToggle } from "@/components/modeToggle";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const MainLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="container">
      <nav className="flex items-center py-2">
        <div className="flex items-center mr-auto gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  to={"/"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    navigationMenuTriggerStyle()
                  )}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to={"/convert"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    navigationMenuTriggerStyle()
                  )}>
                  Convertor
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <ModeToggle />
      </nav>
      <main className={cn("mt-2 h-full", className)}>{children}</main>
    </div>
  );
};

export default MainLayout;
