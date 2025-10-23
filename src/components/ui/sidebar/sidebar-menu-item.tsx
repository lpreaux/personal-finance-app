"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { useSidebar } from "./sidebar-context";
import { useIsActiveRoute } from "./use-is-active-route";
import { SidebarMenuItemIcon } from "./sidebar-menu-item-icon";
import { SidebarMenuItemLabel } from "./sidebar-menu-item-label";

type MenuItemProps = React.ComponentProps<"li"> & {
  asChild?: boolean;
  active?: boolean;
  icon: React.ReactNode;
};

/**
 * Génère les classes CSS d’un item de menu selon son état actif et l’ouverture du sidebar.
 */
function getMenuItemClasses(isActive: boolean, open: boolean): string {
  return cn(
    // Base styles
    "flex h-full justify-center rounded-t-lg pt-2 pb-3 align-middle text-gray-300 text-left",
    // Tablet styles
    "tablet:w-26 tablet:flex-grow-0 tablet:items-center tablet:gap-1 tablet:flex tablet:flex-col",
    // Desktop styles
    "group desktop:w-full desktop:flex-row desktop:gap-4 desktop:px-8 desktop:py-4 desktop:rounded-r-xl desktop:rounded-t-none desktop:border-b-0",
    !open && "desktop:pr-6",
    // Inactive state
    !isActive &&
      "hover:text-white desktop:hover:cursor-pointer desktop:hover:text-white",
    // Active state - Mobile & Tablet
    isActive && "border-b-4 border-teal-800 bg-orange-100 text-gray-900",
    // Active state - Desktop
    isActive &&
      "desktop:border-b-0 desktop:border-l-4 desktop:border-teal-800 desktop:bg-orange-100 desktop:text-gray-900",
  );
}

export function SidebarMenuItem({
  children,
  className,
  asChild = false,
  active,
  icon,
  ...props
}: MenuItemProps) {
  const { open } = useSidebar();

  // ✅ Récupère le premier enfant de manière sûre (tolérante)
  const safeChild = React.Children.toArray(children)[0] as
    | React.ReactElement<{ href?: string; children?: React.ReactNode }>
    | undefined;

  const href = asChild ? safeChild?.props.href : undefined;
  const autoActive = useIsActiveRoute(href);
  const isActive = active ?? autoActive;

  const labelContent = asChild ? safeChild?.props.children : children;

  const content = (
    <>
      <SidebarMenuItemIcon icon={icon} isActive={isActive} />
      <SidebarMenuItemLabel open={open}>{labelContent}</SidebarMenuItemLabel>
    </>
  );

  if (asChild && safeChild) {
    const clonedChild = React.cloneElement(
      safeChild as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
      {
        className: cn(
          getMenuItemClasses(isActive, open),
          safeChild.props.className ?? "",
          className,
        ),
        ...props,
        children: content,
      },
    );

    return (
      <li className="desktop:w-full desktop:flex-grow-0 desktop:relative tablet:w-26 tablet:flex-grow-0 flex-grow">
        {clonedChild}
      </li>
    );
  }

  return (
    <li
      className={cn(getMenuItemClasses(isActive, open), className)}
      {...props}
    >
      {content}
    </li>
  );
}
