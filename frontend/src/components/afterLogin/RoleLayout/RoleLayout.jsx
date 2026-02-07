import { useRef } from "react";
import { Outlet } from "react-router-dom";
import PageLoader from "../../common/PageLoader/PageLoader";
import { ResourceLoadProvider } from "../../../contexts/ResourceLoadContext";
import { usePageResourcesReady } from "../../../hooks/usePageResourcesReady";
import "./RoleLayout.css";

/**
 * Wraps role outlet with the same loading effect as the landing page.
 * Waits for all images and (if present) map in the current page before hiding the loader.
 */
function RoleLayoutContent() {
  const containerRef = useRef(null);
  const { loaderHidden, resourcesReady } = usePageResourcesReady(containerRef);

  return (
    <>
      {!resourcesReady && (
        <PageLoader
          message="Loading..."
          className={loaderHidden ? "page-loader--hidden" : ""}
        />
      )}
      <div ref={containerRef} className="role-layout__container">
        <Outlet />
      </div>
    </>
  );
}

export default function RoleLayout() {
  return (
    <ResourceLoadProvider>
      <RoleLayoutContent />
    </ResourceLoadProvider>
  );
}
