'use client';

import { useEditorStore } from '@/stores/editorStore';

/**
 * Debug information component to help troubleshoot issues
 */
export function DebugInfo() {
  const store = useEditorStore();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Text: &quot;{store.text}&quot;</div>
        <div>Color: {store.color}</div>
        <div>Size: {store.fontSize}</div>
        <div>Loading: {store.isLoading ? 'Yes' : 'No'}</div>
        <div>Last Apply: {store.lastApplyTime > 0 ? new Date(store.lastApplyTime).toLocaleTimeString() : 'Never'}</div>
        <div>Rotation: x={store.rotation.x.toFixed(2)}, y={store.rotation.y.toFixed(2)}, z={store.rotation.z.toFixed(2)}</div>
      </div>
    </div>
  );
}