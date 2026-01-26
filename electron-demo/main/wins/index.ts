
import setupDialogWindow from './dialog';
import { setupMainWindow } from './main';
import setupSetttingWindow from './setting';

export function setupWindows() {
  setupMainWindow();
  setupDialogWindow();
  setupSetttingWindow();
}