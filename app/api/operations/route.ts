import { authorizeOperations, engagementRuntime } from '../../../lib/engagement-runtime';
import { boundedJson, responseJson, serviceFailure } from '../../../lib/request-safety';
import { notificationTopics, PublicServiceError, type NotificationTopic } from '../../../lib/engagement';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function GET(request: Request) {
  try { await authorizeOperations(request); return responseJson(await engagementRuntime().service.operations(new URL(request.url).searchParams.get('cursor') ?? '0')); }
  catch (error) { return serviceFailure(error); }
}
export async function POST(request: Request) {
  try {
    await authorizeOperations(request);
    const body = await boundedJson(request, 40_000); const service = engagementRuntime().service;
    if (body.action === 'approve-scope') return responseJson(await service.approveScope(String(body.id), body));
    if (body.action === 'complete') return responseJson(await service.complete(String(body.id), String(body.report)));
    if (body.action === 'work') return responseJson(await service.work());
    if (body.action === 'publish-update' && notificationTopics.includes(body.topic as NotificationTopic)) {
      await service.publishUpdate(body.topic as NotificationTopic, String(body.title), String(body.summary)); return responseJson({ message: 'Update saved; run the worker to send to confirmed subscribers.' });
    }
    throw new PublicServiceError('Unsupported operation.');
  } catch (error) { return serviceFailure(error); }
}
