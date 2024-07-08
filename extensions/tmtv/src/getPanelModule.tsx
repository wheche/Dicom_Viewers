import React from 'react';
import { PanelPetSUV, PanelROIThresholdExport } from './Panels';
import { Toolbox } from '@ohif/ui';
import i18n from 'i18next';

// TODO:
// - No loading UI exists yet
// - cancel promises when component is destroyed
// - show errors in UI for thumbnails if promise fails

function getPanelModule({ commandsManager, extensionManager, servicesManager }) {
  const wrappedPanelPetSuv = () => {
    return (
      <PanelPetSUV
        commandsManager={commandsManager}
        servicesManager={servicesManager}
      />
    );
  };

  const wrappedROIThresholdToolbox = () => {
    return (
      <>
        <Toolbox
          commandsManager={commandsManager}
          servicesManager={servicesManager}
          extensionManager={extensionManager}
          buttonSectionId="ROIThresholdToolbox"
          title={i18n.t('TMTV:Threshold Tools')}
        />
      </>
    );
  };

  const wrappedROIThresholdExport = () => {
    return (
      <>
        <PanelROIThresholdExport
          commandsManager={commandsManager}
          servicesManager={servicesManager}
        />
      </>
    );
  };

  return [
    {
      name: 'petSUV',
      iconName: 'tab-patient-info',
      iconLabel: 'Patient Info',
      label: i18n.t('TMTV:Patient Info'),
      component: wrappedPanelPetSuv,
    },
    {
      name: 'tmtvBox',
      iconName: 'tab-segmentation',
      iconLabel: 'Segmentation',
      label: i18n.t('TMTV:Segmentation Toolbox'),
      component: wrappedROIThresholdToolbox,
    },
    {
      name: 'tmtvExport',
      iconName: 'tab-segmentation',
      iconLabel: 'Segmentation',
      label: i18n.t('TMTV:Segmentation Export'),
      component: wrappedROIThresholdExport,
    },
  ];
}

export default getPanelModule;
