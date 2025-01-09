mkdir -p ./dist/esm
cat >dist/esm/index.js <<!EOF
import cjsModule from "../index.js";
export const exportActorProfile = cjsModule.exportActorProfile;
export const importActorProfile = cjsModule.importActorProfile;
export const validateExportStream = cjsModule.validateExportStream;
!EOF

cat >dist/esm/package.json <<!EOF
{
  "type": "module"
}
!EOF
