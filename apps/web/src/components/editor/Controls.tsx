'use client';

import { useEditorStore, AVAILABLE_FONTS, DEPTH_PRESETS, COLOR_PALETTE } from '@/stores/editorStore';

/**
 * 에디터 컨트롤 패널 Props
 */
interface ControlsProps {
  className?: string;
}

/**
 * 3D 텍스트 에디터 컨트롤 패널
 * 텍스트, 색상, 폰트 크기, 폰트 패밀리, 애니메이션 타입을 제어합니다.
 */
export function Controls({ className = '' }: ControlsProps) {
  const {
    text,
    color,
    fontSize,
    fontFamily,
    depth,
    rotation,
    setText,
    setColor,
    setFontSize,
    setFontFamily,
    setDepth,
    setRotation,
    resetToDefaults,
    applySettings,
  } = useEditorStore();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">3D 텍스트 설정</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={applySettings}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            적용
          </button>
          <button
            onClick={resetToDefaults}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 텍스트 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          텍스트
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하세요..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          maxLength={100}
        />
        <div className="text-xs text-gray-500 text-right">
          {text.length}/100
        </div>
      </div>

      {/* 색상 선택 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          색상
        </label>
        <div className="flex flex-col space-y-3">
          {/* 색상 피커 */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
          
          {/* 미리 정의된 색상 팔레트 */}
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PALETTE.map((paletteColor) => (
              <button
                key={paletteColor}
                onClick={() => setColor(paletteColor)}
                className={`w-8 h-8 rounded-md border-2 transition-all ${
                  color === paletteColor 
                    ? 'border-gray-800 scale-110' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: paletteColor }}
                title={paletteColor}
              />
            ))}
          </div>
          
          {/* 현재 색상 표시 */}
          <div className="text-xs text-gray-600">
            현재 색상: {color}
          </div>
        </div>
      </div>

      {/* 폰트 크기 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          폰트 크기: {fontSize}px
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1px</span>
          <span>20px</span>
        </div>
      </div>

      {/* 폰트 패밀리 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          폰트
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {AVAILABLE_FONTS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* 글자 두께 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          글자 두께: {depth.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>평면</span>
          <span>두께</span>
        </div>
        
        {/* 두께 프리셋 */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {DEPTH_PRESETS.slice(0, 3).map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDepth(preset.value)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                Math.abs(depth - preset.value) < 0.05
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEPTH_PRESETS.slice(3).map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDepth(preset.value)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                Math.abs(depth - preset.value) < 0.05
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 회전 정보 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          회전 (마우스로 조작)
        </label>
        <div className="space-y-2 text-xs text-gray-600">
          <div>X축: {(rotation.x * 180 / Math.PI).toFixed(1)}°</div>
          <div>Y축: {(rotation.y * 180 / Math.PI).toFixed(1)}°</div>
          <div>Z축: {(rotation.z * 180 / Math.PI).toFixed(1)}°</div>
        </div>
        <button
          onClick={() => setRotation({ x: 0, y: 0, z: 0 })}
          className="w-full px-3 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
        >
          회전 초기화
        </button>
      </div>

      {/* 미리보기 정보 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">미리보기 정보</h3>
        <div className="space-y-1 text-xs text-gray-600">
          <div>텍스트: {text || '(비어있음)'}</div>
          <div>색상: {color}</div>
          <div>크기: {fontSize}px</div>
          <div>폰트: {fontFamily}</div>
          <div>두께: {depth.toFixed(1)}</div>
        </div>
      </div>

      {/* 도움말 */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 팁</h3>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>• 설정을 변경한 후 &quot;적용&quot; 버튼을 클릭하세요</li>
          <li>• 한글과 영어 폰트가 지원됩니다</li>
          <li>• 마우스로 드래그하여 텍스트를 회전시킬 수 있습니다</li>
          <li>• 두께 슬라이더로 3D 효과를 조절하세요</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Tailwind CSS 슬라이더 스타일 (추가 스타일링용)
 */
export const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
  }
`;