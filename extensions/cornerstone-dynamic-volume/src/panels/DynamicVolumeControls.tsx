import React, { useEffect, useState } from 'react';
import {
  InputDoubleRange,
  Button,
  PanelSection,
  ButtonGroup,
  IconButton,
  InputNumber,
  Icon,
  Tooltip,
} from '@ohif/ui';

import { Enums } from '@cornerstonejs/core';
import { useTranslation } from 'react-i18next';

const controlClassNames = {
  sizeClassName: 'w-[58px] h-[28px]',
  arrowsDirection: 'horizontal',
  labelPosition: 'bottom',
};

const Header = ({ title, tooltip }) => (
  <div className="flex items-center space-x-1">
    <Tooltip
      content={<div className="text-white">{tooltip}</div>}
      position="bottom-left"
      tight={true}
      tooltipBoxClassName="max-w-xs p-2"
    >
      <Icon
        name="info-link"
        className="text-primary-active h-[14px] w-[14px]"
      />
    </Tooltip>
    <span className="text-aqua-pale text-[11px] uppercase">{title}</span>
  </div>
);

const DynamicVolumeControls = ({
  isPlaying,
  onPlayPauseChange,
  // fps
  fps,
  onFpsChange,
  minFps,
  maxFps,
  // Frames
  currentFrameIndex,
  onFrameChange,
  framesLength,
  onGenerate,
  onDoubleRangeChange,
  onDynamicClick,
}) => {
  const [computedView, setComputedView] = useState(false);

  const [computeViewMode, setComputeViewMode] = useState(Enums.DynamicOperatorType.SUM);

  const [sliderRangeValues, setSliderRangeValues] = useState([framesLength / 4, framesLength / 2]);

  useEffect(() => {
    setSliderRangeValues([framesLength / 4, framesLength / 2]);
  }, [framesLength]);

  const handleSliderChange = newValues => {
    onDoubleRangeChange(newValues);

    if (newValues[0] === sliderRangeValues[0] && newValues[1] === sliderRangeValues[1]) {
      return;
    }
    setSliderRangeValues(newValues);
  };

  const { t } = useTranslation('DynamicVolumeControls');

  return (
    <div className="flex select-none flex-col">
      <PanelSection
        title={t('Controls')}
        childrenClassName="space-y-4 pb-5 px-5"
      >
        <div className="mt-2">
          <Header
            title={t('View')}
            tooltip={t(
              'Select the view mode, 4D to view the dynamic volume or Computed to view the computed volume'
            )}
          />
          <ButtonGroup className="mt-2 w-full">
            <button
              className="w-1/2"
              onClick={() => {
                setComputedView(false);
                onDynamicClick?.();
              }}
            >
              4D
            </button>
            <button
              className="w-1/2"
              onClick={() => {
                setComputedView(true);
              }}
            >
              {t('Computed')}
            </button>
          </ButtonGroup>
        </div>
        <div>
          <FrameControls
            onPlayPauseChange={onPlayPauseChange}
            isPlaying={isPlaying}
            computedView={computedView}
            // fps
            fps={fps}
            onFpsChange={onFpsChange}
            minFps={minFps}
            maxFps={maxFps}
            //
            framesLength={framesLength}
            onFrameChange={onFrameChange}
            currentFrameIndex={currentFrameIndex}
          />
        </div>
        <div className={`mt-6 flex flex-col ${computedView ? '' : 'ohif-disabled'}`}>
          <Header
            title={t('Computed Operation')}
            tooltip={
              <div>
                {t('Operation Buttons (SUM, AVERAGE, SUBTRACT)')}:{' '}
                {t('Select the mathematical operation to be applied to the data set.')}
                <br></br> {t('Range Slider')}:{' '}
                {t('Choose the numeric range within which the operation will be performed.')}
                <br></br> {t('Generate Button')}:{' '}
                {t('Execute the chosen operation on the specified range of data.')}{' '}
              </div>
            }
          />
          <ButtonGroup
            className={`mt-2 w-full`}
            separated={true}
          >
            <button
              className="w-1/2"
              onClick={() => setComputeViewMode(Enums.DynamicOperatorType.SUM)}
            >
              {t(Enums.DynamicOperatorType.SUM.toString().toUpperCase())}
            </button>
            <button
              className="w-1/2"
              onClick={() => setComputeViewMode(Enums.DynamicOperatorType.AVERAGE)}
            >
              {t(Enums.DynamicOperatorType.AVERAGE.toString().toUpperCase())}
            </button>
            <button
              className="w-1/2"
              onClick={() => setComputeViewMode(Enums.DynamicOperatorType.SUBTRACT)}
            >
              {t(Enums.DynamicOperatorType.SUBTRACT.toString().toUpperCase())}
            </button>
          </ButtonGroup>
          <div className="w-ful mt-2">
            <InputDoubleRange
              values={sliderRangeValues}
              onChange={handleSliderChange}
              minValue={0}
              showLabel={true}
              allowNumberEdit={true}
              maxValue={framesLength}
              step={1}
            />
          </div>
          <Button
            className="mt-2 !h-[26px] !w-[115px] self-start !p-0"
            onClick={() => {
              onGenerate(computeViewMode);
            }}
          >
            {t('Generate')}
          </Button>
        </div>
      </PanelSection>
    </div>
  );
};

export default DynamicVolumeControls;

function FrameControls({
  isPlaying,
  onPlayPauseChange,
  fps,
  minFps,
  maxFps,
  onFpsChange,
  framesLength,
  onFrameChange,
  currentFrameIndex,
  computedView,
}) {
  const getPlayPauseIconName = () => (isPlaying ? 'icon-pause' : 'icon-play');
  const { t } = useTranslation('DynamicVolumeControls');

  return (
    <div className={computedView && 'ohif-disabled'}>
      <Header
        title={t('4D Controls')}
        tooltip={
          <div>
            {t('Play/Pause Button')}: {t('Begin or pause the animation of the 4D visualization.')}
            <br></br> {t('Frame Selector')}:{' '}
            {t('Navigate through individual frames of the 4D data.')} <br></br>{' '}
            {t('FPS (Frames PerSecond) Selector')}:{' '}
            {t('Adjust the playback speed of the animation.')}
          </div>
        }
      />
      <div className="mt-3 flex justify-between">
        <IconButton
          className="bg-customblue-30 h-[26px] w-[58px] rounded-[4px]"
          onClick={() => onPlayPauseChange(!isPlaying)}
        >
          <Icon
            name={getPlayPauseIconName()}
            className="active:text-primary-light hover:bg-customblue-300 h-[24px] w-[24px] cursor-pointer text-white"
          />
        </IconButton>
        <InputNumber
          value={currentFrameIndex}
          onChange={onFrameChange}
          minValue={0}
          maxValue={framesLength}
          label={t('Frame')}
          {...controlClassNames}
        />
        <InputNumber
          value={fps}
          onChange={onFpsChange}
          minValue={minFps}
          maxValue={maxFps}
          {...controlClassNames}
          label={t('FPS')}
        />
      </div>
    </div>
  );
}
